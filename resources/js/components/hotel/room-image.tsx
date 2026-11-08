import { BedDouble } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop';

type RoomImageProps = {
    src: string | null;
    alt: string;
    className?: string;
};

export default function RoomImage({ src, alt, className }: RoomImageProps) {
    const [imageSrc, setImageSrc] = useState(src ?? FALLBACK_IMAGE);
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <div
                className={cn(
                    'flex items-center justify-center bg-muted text-muted-foreground',
                    className,
                )}
            >
                <BedDouble className="size-8" />
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            loading="lazy"
            className={className}
            onError={() => {
                if (imageSrc === FALLBACK_IMAGE) {
                    setHasError(true);

                    return;
                }

                setImageSrc(FALLBACK_IMAGE);
            }}
        />
    );
}
