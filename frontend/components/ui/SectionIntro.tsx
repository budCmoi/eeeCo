type SectionIntroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  align?: 'left' | 'center';
};

export function SectionIntro({ eyebrow, title, copy, align = 'left' }: SectionIntroProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-balance font-display text-4xl leading-none text-ivory md:text-6xl">{title}</h2>
      <p className="mt-5 max-w-xl text-sm leading-7 text-ivory/68 md:text-base">{copy}</p>
    </div>
  );
}