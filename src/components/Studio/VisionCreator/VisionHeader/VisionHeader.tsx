import React from 'react';
import { Header, CreatorBadge, BadgeDot, PageTitle, TitleAccent, PageSubtitle } from './styles';

const VisionHeader: React.FC = () => {
    return (
        <Header>
            <CreatorBadge><BadgeDot>✨</BadgeDot>Vision Creator</CreatorBadge>
            <PageTitle>What will <TitleAccent>Vision</TitleAccent><br/>create for you?</PageTitle>
            <PageSubtitle>Describe your idea — Vision plans every scene.</PageSubtitle>
        </Header>
    );
};

export default VisionHeader;
