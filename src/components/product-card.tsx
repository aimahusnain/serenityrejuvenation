interface ProductCardProps {
  name: string;
}

export const ProductCard = ({ name }: ProductCardProps) => {
  return (
    <div className="rounded-2xl p-8 backdrop-blur-md cursor-pointer">
      <div className="space-y-4">
        <div>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#5d7d6a' }}>
            Featured Product
          </p>
          <h3 className="text-xl sm:text-3xl font-light mt-2 upper underline" style={{ color: '#133316' }}>
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
};
