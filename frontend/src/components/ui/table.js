export const Table = ({ children, className = "" }) => <div className="w-full overflow-x-auto"><table className={`w-full text-sm border-collapse ${className}`}>{children}</table></div>;
export const TableHeader = ({ children }) => <thead>{children}</thead>;
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
export const TableRow = ({ children, className = "", ...props }) => <tr className={className} {...props}>{children}</tr>;
export const TableHead = ({ children, className = "" }) => <th className={`px-4 py-3 text-left font-medium border-b border-line ${className}`}>{children}</th>;
export const TableCell = ({ children, className = "" }) => <td className={`px-4 border-b border-line ${className}`}>{children}</td>;
