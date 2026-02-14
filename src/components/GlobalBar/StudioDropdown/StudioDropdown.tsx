import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styles } from '../Navigation/styles';

/**
 * StudioDropdown Component
 * 
 * A dropdown navigation for Studio sub-sections (Creators, Wizard, Producer Mode).
 * This component is currently not in use but preserved for future implementation.
 * 
 * Usage:
 * <StudioDropdown 
 *   show={showDropdown} 
 *   onMouseEnter={handleMouseEnter}
 *   onMouseLeave={handleMouseLeave}
 * />
 */

interface StudioDropdownProps {
    show: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const StudioDropdown: React.FC<StudioDropdownProps> = ({ show, onMouseEnter, onMouseLeave }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredStudioBtn, setHoveredStudioBtn] = useState<string | null>(null);

    const studioSubButtons = [
        { id: 'creators', label: '👥', text: 'Creators', path: '/studio' },
        { id: 'wizard', label: '✨', text: 'Wizard', path: '/studio/wizard' },
        { id: 'producer', label: '🎯', text: 'Producer Mode', path: '/studio/producer' },
    ];

    return (
        <nav
            style={{
                ...styles.secondaryNav,
                ...(show ? styles.secondaryNavVisible : {}),
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div style={styles.secondaryNavItems}>
                {studioSubButtons.map((subBtn) => {
                    const isSubActive = location.pathname === subBtn.path;
                    const isHovered = hoveredStudioBtn === subBtn.id;

                    return (
                        <a
                            key={subBtn.id}
                            href={subBtn.path}
                            style={{
                                ...styles.btnSub,
                                ...(isSubActive ? styles.btnSubActive : {}),
                                ...(isHovered && !isSubActive ? styles.btnSubHover : {}),
                            }}
                            onMouseEnter={() => setHoveredStudioBtn(subBtn.id)}
                            onMouseLeave={() => setHoveredStudioBtn(null)}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(subBtn.path);
                            }}
                        >
                            <span>{subBtn.label} </span>
                            <span>{subBtn.text}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
};

export default StudioDropdown;
