import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Urban Spice UI error:", error, info);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <h1 className="font-display" style={{ fontSize: 36, color: "var(--color-brown-deep)" }}>
            Something went off the pass.
          </h1>
          <p style={{ marginTop: 12, color: "var(--color-text-mid)" }}>
            Please refresh the page and try again.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
