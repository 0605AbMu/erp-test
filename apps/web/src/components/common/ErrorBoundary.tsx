import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Result, Button } from 'antd';

type Props = {
    children: ReactNode;
};

type State = {
    hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError(): State {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('React Error Boundary:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="error"
                    title="Something went wrong"
                    subTitle="An unexpected error occurred."
                    extra={
                        <Button type="primary" onClick={this.handleReload}>
                            Reload
                        </Button>
                    }
                />
            );
        }

        return this.props.children;
    }
}