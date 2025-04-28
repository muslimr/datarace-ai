import '../styles/global.css';
import 'react-tooltip/dist/react-tooltip.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}