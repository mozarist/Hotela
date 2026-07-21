import { Hotel } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    ...props
}: ComponentPropsWithoutRef<typeof Hotel>) {
    return <Hotel className={cn('size-10', className)} {...props} />;
}
