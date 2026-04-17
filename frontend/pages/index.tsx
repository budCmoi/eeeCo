import { EditionArchiveSection } from '@/components/sections/EditionArchiveSection';
import { LookbookWallSection } from '@/components/sections/LookbookWallSection';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { MotionHeroSection } from '@/components/sections/MotionHeroSection';
import { PrivateListSection } from '@/components/sections/PrivateListSection';
import { RunwayCarouselSection } from '@/components/sections/RunwayCarouselSection';
import { mockProducts } from '@/data/products';

export default function HomePage() {
  return (
    <>
      <MotionHeroSection products={mockProducts} />
      <RunwayCarouselSection products={mockProducts} />
      <ManifestoSection products={mockProducts} />
      <LookbookWallSection products={mockProducts} />
      <EditionArchiveSection products={mockProducts} />
      <PrivateListSection products={mockProducts} />
    </>
  );
}