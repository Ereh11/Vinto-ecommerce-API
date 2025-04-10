async onSubmit() {
  try {
    const formData = new FormData();
    // Add other form fields
    
    if (this.selectedPhoto) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (this.selectedPhoto.size > maxSize) {
        this.errorMessage = 'Profile picture size must be less than 5MB';
        return;
      }
      formData.append('picture', this.selectedPhoto);
    }

    // Rest of your form submission logic
    const response = await this.profileService.createProfile(formData).toPromise();
    // Handle success
  } catch (error) {
    this.errorMessage = error.error?.message || 'Failed to create profile';
  }
} 