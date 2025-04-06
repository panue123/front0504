class ImageCropper {
    constructor() {
        this.cropper = null;
        this.overlay = document.getElementById("overlay-crop-image");
        this.popup = document.getElementById("popup-crop-image");
        this.image = document.getElementById("cropper-image");
        this.cropBtn = document.getElementById("cropImageBtn");
        this.cancelBtn = document.getElementById("cancelCropBtn");
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.cropBtn.addEventListener("click", () => this.cropImage());
        this.cancelBtn.addEventListener("click", () => this.closeCropper());
    }

    openCropper(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.image.src = e.target.result;
                this.togglePopup(true);
                
                // Khởi tạo cropper
                this.cropper = new Cropper(this.image, {
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 1,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: true,
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    cropImage() {
        if (!this.cropper) return;

        const canvas = this.cropper.getCroppedCanvas({
            width: 400,
            height: 400
        });

        canvas.toBlob((blob) => {
            const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
            this.closeCropper();
            this.onCropComplete(croppedFile);
        }, "image/jpeg", 0.9);
    }

    closeCropper() {
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
        this.togglePopup(false);
    }

    togglePopup(isOpen) {
        this.overlay.style.display = isOpen ? "block" : "none";
        this.popup.style.display = isOpen ? "block" : "none";
    }

    onCropComplete(croppedFile) {
        // Sự kiện này sẽ được ghi đè bởi các class khác
        console.log("Cropped file:", croppedFile);
    }
}

// Export để sử dụng ở các file khác
window.ImageCropper = ImageCropper; 