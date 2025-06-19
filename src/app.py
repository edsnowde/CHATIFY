from flask import Flask, request, jsonify
from flask_cors import CORS
import httpx
import asyncio
import base64
import tempfile
import os
import json
import logging
from PIL import Image
import numpy as np
from typing import Dict, List, Any, Tuple
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Sightengine API Configuration
SIGHTENGINE_CONFIG = {
    'api_user': 'enter you ID',
    'api_secret': 'api secret code here',
    'endpoint': 'https://api.sightengine.com/1.0/check.json',
    'models': 'nudity-2.1,weapon,alcohol,recreational_drug,medical,properties,type,quality,offensive-2.0,faces,scam,text-content,face-attributes,gore-2.0,text,qr-content,tobacco,genai,violence,self-harm,money,gambling'
}

# Safety thresholds
SAFETY_THRESHOLD = 0.10  # 10% threshold for flagging content

class ImageModerationService:
    """Service class for handling image moderation and safety checks"""
    
    def __init__(self):
        self.sightengine_config = SIGHTENGINE_CONFIG
        
    async def check_content_moderation(self, image_path: str) -> Dict[str, Any]:
        """
        Check image content using Sightengine API
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dict containing moderation results
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # Prepare the request data
                data = {
                    'models': self.sightengine_config['models'],
                    'api_user': self.sightengine_config['api_user'],
                    'api_secret': self.sightengine_config['api_secret']
                }
                
                # Open and send the image file
                with open(image_path, 'rb') as image_file:
                    files = {'media': image_file}
                    response = await client.post(
                        self.sightengine_config['endpoint'],
                        data=data,
                        files=files
                    )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Sightengine API error: {response.status_code} - {response.text}")
                    return {"error": f"API request failed with status {response.status_code}"}
                    
        except Exception as e:
            logger.error(f"Content moderation error: {str(e)}")
            return {"error": f"Content moderation failed: {str(e)}"}
    
    def check_deepfake_detection(self, image_path: str, text_content: str = "") -> Dict[str, Any]:
        """
        Simulated deepfake detection (placeholder for actual ML model)
        
        Args:
            image_path: Path to the image file
            text_content: Associated text content
            
        Returns:
            Dict containing deepfake detection results
        """
        try:
            # Check for suspicious keywords in text
            suspicious_keywords = ['fake', 'deepfake', 'generated', 'ai-generated', 'synthetic']
            text_suspicious = any(keyword in text_content.lower() for keyword in suspicious_keywords)
            
            # Simple image analysis (placeholder for actual deepfake detection)
            with Image.open(image_path) as img:
                # Convert to numpy array
                img_array = np.array(img.convert('RGB'))
                
                # Calculate mean brightness (placeholder metric)
                mean_brightness = np.mean(img_array)
                
                # Placeholder deepfake detection logic
                # In production, this would be replaced with an actual ML model
                image_suspicious = False
                
                # Simple heuristics (these are just examples - not real deepfake detection)
                if mean_brightness < 50 or mean_brightness > 200:  # Unusual brightness
                    image_suspicious = True
                
                # Check image dimensions for common deepfake resolutions
                width, height = img.size
                common_deepfake_sizes = [(512, 512), (1024, 1024), (256, 256)]
                if (width, height) in common_deepfake_sizes:
                    image_suspicious = True
            
            confidence_score = 0.8 if (text_suspicious or image_suspicious) else 0.1
            
            return {
                "is_deepfake": text_suspicious or image_suspicious,
                "confidence": confidence_score,
                "text_suspicious": text_suspicious,
                "image_suspicious": image_suspicious,
                "mean_brightness": float(mean_brightness),
                "image_dimensions": f"{width}x{height}"
            }
            
        except Exception as e:
            logger.error(f"Deepfake detection error: {str(e)}")
            return {
                "error": f"Deepfake detection failed: {str(e)}",
                "is_deepfake": False,
                "confidence": 0.0
            }
    
    def analyze_moderation_results(self, moderation_data: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Analyze Sightengine moderation results and determine if content is unsafe
        
        Args:
            moderation_data: Results from Sightengine API
            
        Returns:
            Tuple of (is_unsafe: bool, reasons: List[str])
        """
        if "error" in moderation_data:
            return False, ["Error in content moderation"]
        
        unsafe_reasons = []
        
        # Check various categories
        categories_to_check = [
            ('nudity', 'nudity'),
            ('weapon', 'weapon'),
            ('alcohol', 'alcohol'),
            ('recreational_drug', 'recreational_drug'),
            ('violence', 'violence'),
            ('gore', 'gore'),
            ('offensive', 'offensive')
        ]
        
        for category, reason in categories_to_check:
            if category in moderation_data:
                prob = moderation_data[category].get('prob', 0) if isinstance(moderation_data[category], dict) else moderation_data[category]
                if prob > SAFETY_THRESHOLD:
                    unsafe_reasons.append(f"{reason} content detected (confidence: {prob:.2f})")
        
        # Check text content if present
        if 'text' in moderation_data and moderation_data['text'].get('has_text', False):
            text_data = moderation_data['text']
            if text_data.get('profanity', {}).get('prob', 0) > SAFETY_THRESHOLD:
                unsafe_reasons.append("Profanity in text detected")
        
        # Check faces for explicit content
        if 'faces' in moderation_data:
            for face in moderation_data['faces']:
                if face.get('attributes', {}).get('emotion', {}).get('angry', 0) > 0.8:
                    unsafe_reasons.append("Potentially aggressive facial expression detected")
        
        return len(unsafe_reasons) > 0, unsafe_reasons

# Initialize the moderation service
moderation_service = ImageModerationService()

def decode_base64_image(base64_string: str) -> str:
    """
    Decode base64 image and save to temporary file
    
    Args:
        base64_string: Base64 encoded image
        
    Returns:
        Path to temporary image file
    """
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            temp_file.write(image_data)
            return temp_file.name
            
    except Exception as e:
        logger.error(f"Base64 decode error: {str(e)}")
        raise ValueError(f"Failed to decode base64 image: {str(e)}")

async def process_single_image(image_data: str, text_content: str = "") -> Dict[str, Any]:
    """
    Process a single image through moderation and deepfake detection
    
    Args:
        image_data: Base64 encoded image or file path
        text_content: Associated text content
        
    Returns:
        Dict containing all analysis results
    """
    temp_file_path = None
    
    try:
        # Handle base64 images
        if image_data.startswith('data:') or len(image_data) > 1000:
            temp_file_path = decode_base64_image(image_data)
        else:
            temp_file_path = image_data
        
        # Run content moderation and deepfake detection concurrently
        moderation_task = moderation_service.check_content_moderation(temp_file_path)
        deepfake_result = moderation_service.check_deepfake_detection(temp_file_path, text_content)
        
        # Wait for moderation result
        moderation_result = await moderation_task
        
        # Analyze moderation results
        is_unsafe_content, unsafe_reasons = moderation_service.analyze_moderation_results(moderation_result)
        
        # Combine results
        is_deepfake = deepfake_result.get('is_deepfake', False)
        is_flagged = is_unsafe_content or is_deepfake
        
        all_reasons = []
        if is_unsafe_content:
            all_reasons.extend(unsafe_reasons)
        if is_deepfake:
            all_reasons.append(f"Potential deepfake detected (confidence: {deepfake_result.get('confidence', 0):.2f})")
        
        return {
            "is_safe": not is_flagged,
            "is_flagged": is_flagged,
            "reasons": all_reasons,
            "content_moderation": {
                "is_unsafe": is_unsafe_content,
                "details": moderation_result,
                "unsafe_reasons": unsafe_reasons
            },
            "deepfake_detection": deepfake_result
        }
        
    except Exception as e:
        logger.error(f"Image processing error: {str(e)}")
        return {
            "is_safe": False,
            "is_flagged": True,
            "reasons": [f"Processing error: {str(e)}"],
            "error": str(e)
        }
    
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                logger.warning(f"Failed to delete temp file: {str(e)}")

# API Endpoints

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Image Moderation API",
        "timestamp": os.times().elapsed
    })

@app.route('/api/moderate', methods=['POST'])
def moderate_content():
    """
    Main endpoint for content moderation
    
    Expected JSON payload:
    {
        "images": ["base64_image_1", "base64_image_2", ...],
        "text": "Optional text content"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        images = data.get('images', [])
        text_content = data.get('text', '')
        
        if not images:
            return jsonify({"error": "No images provided"}), 400
        
        # Process images asynchronously
        async def process_all_images():
            tasks = [process_single_image(img, text_content) for img in images]
            return await asyncio.gather(*tasks)
        
        # Run the async processing
        results = asyncio.run(process_all_images())
        
        # Aggregate results
        overall_safe = all(result.get('is_safe', False) for result in results)
        overall_flagged = any(result.get('is_flagged', False) for result in results)
        
        all_reasons = []
        for i, result in enumerate(results):
            if result.get('reasons'):
                all_reasons.extend([f"Image {i+1}: {reason}" for reason in result['reasons']])
        
        response = {
            "overall_safe": overall_safe,
            "overall_flagged": overall_flagged,
            "total_images": len(images),
            "flagged_images": sum(1 for r in results if r.get('is_flagged', False)),
            "reasons": all_reasons,
            "detailed_results": results,
            "processing_info": {
                "text_analyzed": bool(text_content),
                "safety_threshold": SAFETY_THRESHOLD
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Moderation endpoint error: {str(e)}")
        return jsonify({
            "error": f"Processing failed: {str(e)}",
            "overall_safe": False,
            "overall_flagged": True
        }), 500

@app.route('/api/moderate/single', methods=['POST'])
def moderate_single_image():
    """
    Endpoint for moderating a single image
    
    Expected JSON payload:
    {
        "image": "base64_image_data",
        "text": "Optional text content"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400
        
        image_data = data['image']
        text_content = data.get('text', '')
        
        # Process single image
        result = asyncio.run(process_single_image(image_data, text_content))
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Single image moderation error: {str(e)}")
        return jsonify({
            "error": f"Processing failed: {str(e)}",
            "is_safe": False,
            "is_flagged": True,
            "reasons": [str(e)]
        }), 500

@app.route('/api/deepfake-check', methods=['POST', 'OPTIONS'])
def deepfake_check():
    """
    Dedicated endpoint for deepfake detection that your frontend is calling
    
    Expected JSON payload:
    {
        "image": "base64_image_data",
        "text": "Optional text content"
    }
    """
    # Handle CORS preflight requests
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Handle both single image and multiple images
        if 'image' in data:
            # Single image
            image_data = data['image']
            text_content = data.get('text', '')
            result = asyncio.run(process_single_image(image_data, text_content))
            
            # Format response for deepfake-specific endpoint
            deepfake_result = result.get('deepfake_detection', {})
            return jsonify({
                "is_deepfake": deepfake_result.get('is_deepfake', False),
                "confidence": deepfake_result.get('confidence', 0.0),
                "details": deepfake_result,
                "content_moderation": result.get('content_moderation', {}),
                "overall_safe": result.get('is_safe', False),
                "reasons": result.get('reasons', [])
            })
            
        elif 'images' in data:
            # Multiple images
            images = data['images']
            text_content = data.get('text', '')
            
            async def process_all_images():
                tasks = [process_single_image(img, text_content) for img in images]
                return await asyncio.gather(*tasks)
            
            results = asyncio.run(process_all_images())
            
            # Aggregate deepfake results
            deepfake_detected = any(r.get('deepfake_detection', {}).get('is_deepfake', False) for r in results)
            overall_confidence = max((r.get('deepfake_detection', {}).get('confidence', 0) for r in results), default=0.0)
            
            return jsonify({
                "is_deepfake": deepfake_detected,
                "confidence": overall_confidence,
                "total_images": len(images),
                "deepfake_images": sum(1 for r in results if r.get('deepfake_detection', {}).get('is_deepfake', False)),
                "detailed_results": results,
                "overall_safe": all(r.get('is_safe', False) for r in results)
            })
        
        else:
            return jsonify({"error": "No image or images provided"}), 400
        
    except Exception as e:
        logger.error(f"Deepfake check error: {str(e)}")
        return jsonify({
            "error": f"Deepfake check failed: {str(e)}",
            "is_deepfake": False,
            "confidence": 0.0,
            "overall_safe": False
        }), 500

if __name__ == '__main__':
    logger.info("Starting Image Moderation API...")
    logger.info(f"Safety threshold set to: {SAFETY_THRESHOLD}")
    app.run(debug=True, host='0.0.0.0', port=5000)