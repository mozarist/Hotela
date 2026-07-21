import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

type AppLogoProps = {
    className?: string;
};

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <div className={cn('flex items-center gap-1.5', className)}>
            <div className="flex aspect-square items-center justify-center text-primary">
                <AppLogoIcon className="size-6" />
            </div>
            <div className="grid flex-1 text-left text-xl group-data-[collapsible=icon]:hidden">
                <span className="truncate text-primary font-semibold leading-tight group-data-[collapsible=icon]:hidden">
                    Hotela
                </span>
            </div>
        </div>
    );
}
