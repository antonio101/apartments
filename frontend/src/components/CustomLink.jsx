
import React, { Fragment } from 'react';
import { Link, LinkProps,  useMatch, useResolvedPath } from "react-router-dom";

export function CustomLink({ children, to, ...props }: LinkProps) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    return (
        <Fragment>
            <Link
                style={{ textDecoration: match ? "underline" : "none" }}
                to={to}
                {...props}
            >
                {children}
            </Link>
        </Fragment>
    );
}