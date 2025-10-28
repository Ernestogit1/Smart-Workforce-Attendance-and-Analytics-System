import os
from typing import Tuple, Optional

import cloudinary
import cloudinary.uploader

_configured = False

def ensure_cloudinary() -> None:
    global _configured
    if _configured:
        return

    url = os.getenv("CLOUDINARY_URL")
    if url:
        cloudinary.config(cloudinary_url=url, secure=True)
    else:
        cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
        api_key = os.getenv("CLOUDINARY_API_KEY")
        api_secret = os.getenv("CLOUDINARY_API_SECRET")
        if not (cloud_name and api_key and api_secret):
            raise RuntimeError("Cloudinary creds missing. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.")
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True,
        )
        os.environ.setdefault(
            "CLOUDINARY_URL",
            f"cloudinary://{api_key}:{api_secret}@{cloud_name}"
        )
    _configured = True

def upload_profile_image(file, folder: str = "employees") -> Tuple[Optional[str], Optional[str]]:
    """
    Uploads an image file to Cloudinary and returns (secure_url, public_id).
    """
    ensure_cloudinary()
    if not file:
        return None, None
    res = cloudinary.uploader.upload(
        file,
        folder=folder,
        overwrite=False,
        resource_type="image",
    )
    return res.get("secure_url"), res.get("public_id")