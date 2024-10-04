// Get elements
const customizeBtn = document.getElementById('customize-btn');
const customizePopup = document.getElementById('customize-popup');
const wallpaperInput = document.getElementById('wallpaper-input');
const blurWallpaperCheckbox = document.getElementById('blur-wallpaper');
const buttonColorPicker = document.getElementById('button-color-picker');
const saveCustomizeBtn = document.getElementById('save-customize-btn');
const wallpaperContainer = document.getElementById('wallpaper-container');

// Open customize popup
customizeBtn.addEventListener('click', () => {
  customizePopup.classList.remove('hidden');
  // Preload current accent color into button color picker
  const storedButtonColor = localStorage.getItem('buttonColor');
  if (storedButtonColor) {
    buttonColorPicker.value = storedButtonColor;
  }
  // Preload current blur wallpaper setting
  const storedBlurWallpaper = localStorage.getItem('blurWallpaper');
  if (storedBlurWallpaper === 'true') {
    blurWallpaperCheckbox.checked = true;
  }
});

// Save customize settings
saveCustomizeBtn.addEventListener('click', () => {
  // Get wallpaper file
  const wallpaperFile = wallpaperInput.files[0];
  if (wallpaperFile) {
    // Store wallpaper in local storage
    const wallpaperDataURL = URL.createObjectURL(wallpaperFile);
    localStorage.setItem('wallpaper', wallpaperDataURL);
    // Set wallpaper as background image
    wallpaperContainer.style.backgroundImage = `url(${wallpaperDataURL})`;
  }

  // Get button color
  const buttonColor = buttonColorPicker.value;
  // Store button color in local storage
  localStorage.setItem('buttonColor', buttonColor);
  // Set button color as --accent-color variable
  document.documentElement.style.setProperty('--accent-color', buttonColor);

  // Get blur wallpaper setting
  const blurWallpaper = blurWallpaperCheckbox.checked;
  // Store blur wallpaper setting in local storage
  localStorage.setItem('blurWallpaper', blurWallpaper);
  // Apply blur wallpaper setting
  if (blurWallpaper) {
    wallpaperContainer.classList.add('blur');
  } else {
    wallpaperContainer.classList.remove('blur');
  }

  // Close customize popup
  customizePopup.classList.add('hidden');
});

// Load customize settings on page load
document.addEventListener('DOMContentLoaded', () => {
  // Load wallpaper from local storage
  const storedWallpaper = localStorage.getItem('wallpaper');
  if (storedWallpaper) {
    wallpaperContainer.style.backgroundImage = `url(${storedWallpaper})`;
  }

  // Load button color from local storage
  const storedButtonColor = localStorage.getItem('buttonColor');
  if (storedButtonColor) {
    document.documentElement.style.setProperty('--accent-color', storedButtonColor);
  }

  // Load blur wallpaper setting from local storage
  const storedBlurWallpaper = localStorage.getItem('blurWallpaper');
  if (storedBlurWallpaper === 'true') {
    wallpaperContainer.classList.add('blur');
  }
});