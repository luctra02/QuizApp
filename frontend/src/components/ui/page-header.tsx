interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center">
        {icon && <span className="mr-4 text-5xl">{icon}</span>}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          {title}
        </span>
      </h1>
      {description && (
        <p className="text-slate-300 text-xl max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}