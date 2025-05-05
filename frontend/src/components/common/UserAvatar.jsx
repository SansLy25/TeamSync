import {User} from 'lucide-react';

function UserAvatar({src, size = 'md', alt = 'User avatar'}) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    if (!src) {
        return (
            <div className={`${sizeClasses[size]} rounded-full bg-dark-600 flex items-center justify-center`}>
                <User className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'}/>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`${sizeClasses[size]} rounded-full object-cover border-2 border-dark-500`}
            onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<div class="${sizeClasses[size]} rounded-full bg-dark-600 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="${size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>`;
            }}
        />
    );
}

export default UserAvatar;