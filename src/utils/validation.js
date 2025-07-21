const validator = require('validator');
const { URL } = require('url');

const validateSignupData = (req) => {
  const { firstName, emailId, password, age, gender, photoUrl, about, skills } = req.body;

  const isValidImageUrl = (urlString) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!validator.isURL(urlString)) return false;

    try {
      const url = new URL(urlString);
      const pathname = url.pathname.toLowerCase();
      const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
      if (!hasValidExtension && url.searchParams.has('q')) {
        return true;
      }
      return hasValidExtension;
    } catch (error) {
      return false;
    }
  };

  // Required fields
  if (!firstName) {
    throw new Error('First Name is not valid');
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error('First Name should be between 4-50 characters');
  }

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error(emailId + ' is not a valid email');
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error('Password is not strong enough');
  }

  // Optional fields
  if (photoUrl && photoUrl.trim() && !isValidImageUrl(photoUrl)) {
    throw new Error('Photo URL is not valid');
  }

  if (photoUrl && photoUrl.length > 500) {
    throw new Error('Image URL is too long and potentially unsafe');
  }

  if (skills && skills.length > 10) {
    throw new Error('Skills cannot be more than 10');
  }

  if (about && about.length > 400) {
    throw new Error('About section cannot exceed 400 characters');
  }

  if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase().trim())) {
    throw new Error('Gender must be male, female, or other');
  }

  if (age !== undefined) {
    if (typeof age !== 'number' || isNaN(age)) {
      throw new Error('Age must be a valid number');
    } else if (age < 18) {
      throw new Error('You must be at least 18 years old to sign up');
    } else if (age > 120) {
      throw new Error('Age must be less than 120');
    }
  }
};

const ValidateEditProfileData = (req) => {
  const { firstName, lastName, emailId, age, gender, photoUrl, about, skills } = req.body;

  const isValidImageUrl = (urlString) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!validator.isURL(urlString)) return false;
    try {
      const url = new URL(urlString);
      const pathname = url.pathname.toLowerCase();
      const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
      if (!hasValidExtension && url.searchParams.has('q')) return true;
      return hasValidExtension;
    } catch (err) {
      return false;
    }
  };

  if (firstName && (firstName.length < 2 || firstName.length > 50)) {
    throw new Error('First Name should be 2-50 characters');
  }

  if (lastName && lastName.length > 50) {
    throw new Error('Last Name is too long');
  }

  if (emailId && !validator.isEmail(emailId)) {
    throw new Error('Invalid email');
  }

  if (age !== undefined) {
    if (typeof age !== 'number' || isNaN(age)) {
      throw new Error('Age must be a valid number');
    } else if (age < 18 || age > 120) {
      throw new Error('Age must be between 18 and 120');
    }
  }

  if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
    throw new Error('Gender must be male, female, or other');
  }

  if (photoUrl && !isValidImageUrl(photoUrl)) {
    throw new Error('Invalid image URL');
  }

  if (about && about.length > 400) {
    throw new Error('About section too long');
  }

  if (skills && (!Array.isArray(skills) || skills.length > 10)) {
    throw new Error('Skills must be an array of max 10');
  }

  return true;
};



module.exports  = {validateSignupData,ValidateEditProfileData}