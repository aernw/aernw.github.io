import { createRoot } from 'react-dom/client';

const App = () => {
    return (
        <div>Hello hi </div>
    );
};

const domNode = document.getElementById("root") as HTMLElement;
const root = createRoot(domNode);

root.render(<App />);
