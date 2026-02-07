export default function Card({ imgUrl, alt = "" }: { imgUrl: string; alt: string }) {
  return (
    <div className=" w-full h-[220px] md:h-[360px] bg-black overflow-hidden rounded-md overflow-hidden">
      <img src={imgUrl} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}
