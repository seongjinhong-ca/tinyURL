import React, {ReactNode} from 'react';

interface RouterProps = {
    children: ReactNode;
}
export const Router: React.FC<RouterProps> = ({
    children
}) => {

    const {dashboard} = children;
    return(
        <>
            This is Router.
            <br />
            {children}
        </>
    )
}