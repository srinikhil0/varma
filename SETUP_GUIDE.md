# Secure CMS Setup Guide

## 🔐 **Secure Access Methods**

Your friend can access the CMS in **3 secure ways**:

### **Method 1: Keyboard Shortcut (Recommended)**
- Press **`Ctrl + Shift + Alt + C`** (Windows/Linux) or **`Cmd + Shift + Alt + C`** (Mac)
- This will open a login modal
- Enter credentials to access CMS

### **Method 2: Direct URL Access**
- Navigate to: `https://yourdomain.com/admin` (when deployed)
- Or: `http://localhost:5173/admin` (in development)
- Login with credentials

### **Method 3: Hidden Admin Route**
- Navigate to: `https://yourdomain.com/cms` (when deployed)
- Login with credentials

## 🛠️ **Setup Instructions**

### **1. Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database**
5. Enable **Storage** (for images)

### **2. Create Admin User**
1. In Firebase Console, go to **Authentication**
2. Click **Add User**
3. Enter your friend's email and password
4. Save the credentials securely

### **3. Configure Environment**
Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
```

### **4. Set Firestore Rules**
In Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to website content
    match /website-content/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow read/write to website settings for authenticated users
    match /website-settings/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔒 **Security Features**

- ✅ **No public access** to CMS
- ✅ **Authentication required** for all CMS operations
- ✅ **Secure keyboard shortcut** (4-key combination)
- ✅ **Session management** with automatic logout
- ✅ **Database rules** prevent unauthorized access
- ✅ **No visible UI elements** for CMS access

## 📱 **How to Use**

1. **Access CMS**: Use keyboard shortcut `Ctrl+Shift+Alt+C`
2. **Login**: Enter email and password
3. **Edit Content**: Modify text, toggle sections, upload images
4. **Publish**: Click "Publish Changes" to go live
5. **Logout**: Click "Logout" button when done

## 🚨 **Important Security Notes**

- **Never share** the keyboard shortcut publicly
- **Use strong passwords** for admin account
- **Keep credentials** in a secure password manager
- **Regularly update** admin password
- **Monitor access** through Firebase Console

## 🆘 **Troubleshooting**

### **Can't Access CMS?**
- Check if Firebase is properly configured
- Verify admin user exists in Firebase Authentication
- Ensure environment variables are set correctly
- Check browser console for errors

### **Changes Not Saving?**
- Verify Firestore rules allow authenticated writes
- Check if user is properly authenticated
- Ensure Firebase project has billing enabled (if needed)

---

**Your friend now has secure, private access to edit the website content!** 🎉 