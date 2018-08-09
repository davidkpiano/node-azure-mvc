import * as React from 'react';

interface IBaseLayoutProps {
    title: string;
}

class BaseLayout extends React.Component<IBaseLayoutProps> {
    render() {
        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                    <header>
                        <h1>{this.props.title} - Movie App</h1>
                    </header>
                    <main>{this.props.children}</main>
                </body>
            </html>
        );
    }
}

export default BaseLayout;
