import * as React from 'react';
import BaseLayout from '../layouts/base';

interface IMoviesViewProps {
    title: string;
}

class MoviesView extends React.Component<IMoviesViewProps> {
    render() {
        return (
            <BaseLayout title={this.props.title}>
                <h2>Index</h2>
                <p>Hello from our MoviesView component!</p>
            </BaseLayout>
        );
    }
}

export default MoviesView;
