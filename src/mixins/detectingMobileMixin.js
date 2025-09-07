export function isMobile() {
    // Modern approach: Check for touch capability and screen size first
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const smallScreen = window.innerWidth <= 768; // Common mobile breakpoint

    // If we have modern APIs, use them for better accuracy
    if ('userAgentData' in navigator && navigator.userAgentData) {
        return navigator.userAgentData.mobile;
    }

    // Enhanced user agent detection with updated patterns
    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';

    // Updated mobile detection regex with modern devices and browsers
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|silk|kindle|playbook|bb10|meego|fennec|minimo|symbian|psp|nintendo|wii|palm|phone|mobile\s*safari|opera\s*mobi|windows\s*phone|bada|tizen|sailfish|ubuntu\s*touch|firefox\s*mobile|chrome\s*mobile|samsung|huawei|xiaomi|oppo|vivo|oneplus|lg\-|motorola|nokia|htc\-|sony|asus|acer|lenovo|alcatel|zte|tcl|realme|honor|redmi/i;

    // Specific modern device patterns
    const modernMobilePatterns = [
        /iPhone|iPad|iPod/i,                    // iOS devices
        /Android.+Mobile|Android.+Tablet/i,     // Android devices
        /Windows Phone|WPDesktop/i,             // Windows Phone
        /BlackBerry|PlayBook|BB10/i,            // BlackBerry
        /Opera Mini|Opera Mobi/i,               // Opera mobile browsers
        /Mobile.*Firefox|FxiOS/i,               // Firefox mobile
        /CriOS|Chrome.*Mobile|Chrome.*Tablet/i, // Chrome mobile
        /Edge.*Mobile|EdgiOS/i,                 // Edge mobile
        /Samsung.*Mobile|SM-[A-Z]/i,            // Samsung devices
        /Huawei|Honor|HMA-|LYA-|SNE-/i,         // Huawei/Honor devices
        /Xiaomi|Mi\s|Redmi|M2\d{3}/i,          // Xiaomi devices
        /OnePlus|ONEPLUS/i,                     // OnePlus devices
        /OPPO|CPH\d{4}|PBCM30|PBEM00/i,        // OPPO devices
        /vivo|V\d{4}|PD\d{4}/i,                // Vivo devices
        /LG-|LM-|VS\d{3}|H\d{3}/i,             // LG devices
        /Pixel|Nexus/i,                         // Google devices
        /Tesla/i                                // Tesla browser
    ];

    // Check main regex first
    if (mobileRegex.test(userAgent)) {
        console.log('Mobile detected via main regex');
        return true;
    }

    // Check specific modern patterns
    for (const pattern of modernMobilePatterns) {
        if (pattern.test(userAgent)) {
            console.log('Mobile detected via modern pattern:', pattern);
            return true;
        }
    }

    // Enhanced tablet detection
    const tabletRegex = /tablet|ipad|playbook|silk|android(?!.*mobile)/i;
    if (tabletRegex.test(userAgent)) {
        console.log('Tablet detected');
        return true;
    }

    // Fallback: combine touch capability with screen size for unknown devices
    if (hasTouch && smallScreen) {
        console.log('Mobile detected via touch + screen size fallback');
        return true;
    }

    // Additional check for newer devices that might not match patterns
    const isLikelyMobile = (
        hasTouch &&
        (window.screen.width <= 1024 || window.innerWidth <= 1024) &&
        'orientation' in window
    );

    if (isLikelyMobile) {
        console.log('Mobile detected via feature detection fallback');
        return true;
    }

    console.log('Desktop detected');
    return false;
}

// Comprehensive device info function (bonus)
export function getDeviceInfo() {
    const userAgent = navigator.userAgent || '';
    const mobile = isMobile();

    return {
        isMobile: mobile,
        isTablet: /tablet|ipad|playbook|silk/i.test(userAgent),
        isIOS: /iPhone|iPad|iPod/i.test(userAgent),
        isAndroid: /Android/i.test(userAgent),
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        userAgent: userAgent.substring(0, 100) + (userAgent.length > 100 ? '...' : '')
    };
}