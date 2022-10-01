export const ScrollListContainer: React.FC = ({ children }) => {
  return (
    <div className="w-full flex flex-col gap-8 p-8 overflow-y-scroll">
      {children}
    </div>
  );
};
