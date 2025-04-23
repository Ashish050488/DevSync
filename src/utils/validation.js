const  validator = require('validator');
const {URL} =  require('url')

const validateSignupData = (req)=>{
    const {firstName,emailId,password,age,gender,photoUrl,about,skills} = req.body;


    const isValidImageUrl = (urlString) => {
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
        // First, validate if the URL itself is correct
        if (!validator.isURL(urlString)) return false;
    
        try {
            const url = new URL(urlString);
    
            // Check if the URL contains a valid image extension anywhere in the pathname
            const pathname = url.pathname.toLowerCase();
            const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    
            // If the pathname does not end with an image extension, check if the URL has query params that indicate it's an image
            if (!hasValidExtension && url.searchParams.has('q')) {
                return true;  // This is a heuristic check, assuming images with `q` query parameter in the URL are images
            }
    
            return hasValidExtension;
        } catch (error) {
            return false;  // Invalid URL format
        }
    };
    
    

    if(!firstName ){
        throw new Error('First Name is not valid')
    }
    else if(firstName.length<4 || firstName.length>50){
        throw new Error('First Name should be between 4-50 charactes')
    }
    else if(!emailId || !validator.isEmail(emailId)){
        throw new Error (emailId+'is not a valid email')
    }
    else if(!password || !validator.isStrongPassword(password)){
        throw new Error ('password is not strong enough')
    }
    else if (photoUrl && photoUrl.trim() && !isValidImageUrl(photoUrl)) {
        throw new Error('Photo URL is not valid');
    }
    
    else if(skills && skills.length>10){
        throw new Error('skills cannot be more than 10')
    }
    else if (photoUrl && photoUrl.length > 500) {
        throw new Error('Image url is too long and is potentially unsafe');
    }
    if (about && about.length > 400) {
        throw new Error('About section cannot exceed 300 characters');
    }
    else if (!['male', 'female', 'other'].includes(gender.toLowerCase().trim())) {
        throw new Error('Gender must be male, female, or other');
    }
    else if (typeof age !== 'number' || isNaN(age)) {
        throw new Error('Age must be a valid number');
    }
    else if (age < 18) {
        throw new Error('You must be at least 18 years old to sign up');
    }
    else if (age > 120) {
        throw new Error('Age must be less than 120');
    }
}

const ValidateEditProfileData = (req) => {
    const AllowedFields = [
        'firstName',
        'lastName',
        'emailId',
        'age',
        'gender',
        'photoUrl',
        'about',
        'skills'
    ]

    const isEditAllowed = Object.keys(req.body).every((field) => {
        AllowedFields.includes(field)
    });

    return isEditAllowed
}


module.exports  = {validateSignupData,ValidateEditProfileData}