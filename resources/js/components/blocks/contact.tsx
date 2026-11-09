import { Card } from '@/components/ui/card';
import WhatsAppIcon from '@/components/icons/whatsapp-icon';
import { Mail, Clock, MapPin } from 'lucide-react';
import { InstagramIcon } from '../icons/instagram-icon';

export default function Contact() {
    const contactItems = [
        {
            icon: WhatsAppIcon,
            label: 'WhatsApp',
            value: '0813-8341-5432',
            href: 'https://wa.me/6281383415432',
        },
        {
            icon: Mail,
            label: 'Email',
            value: 'hotela@gmail.com',
            href: '#',
        },
        {
            icon: InstagramIcon,
            label: 'Instagram',
            value: '@hotela.id',
            href: 'https://instagram.com/mozarist.dev',
        },
        {
            icon: Clock,
            label: 'Operating Hours',
            value: '24/7',
            href: '#',
        }
    ];

    const address =
        'Jl. Poras No.07, RT.01/RW.04, Loji, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16117';
    const mapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

    return (
        <>
            {/* Header */}
            <section className="flex w-full max-w-7xl flex-col gap-3 px-4">
                <h1 className="font-serif text-6xl leading-[1.05] font-medium capitalize sm:text-7xl">
                    Contact Us
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    Have questions or need assistance? Reach out to us through any of the channels below, and our team will be happy to help you.
                </p>
            </section>

            {/* Contact info + map */}
            <section className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 px-4">
                {/* Left: contact channels */}
                <div className="flex flex-col gap-6">
                    {contactItems.map(
                        ({ icon: Icon, label, value, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="group flex flex-row items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                                        <Icon
                                            className="h-5 w-5"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {label}
                                        </span>
                                        <span className="text-lg font-medium">
                                            {value}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ),
                    )}
                </div>

                {/* Right: location / map */}
                <Card className="px-6">
                    <h2 className="text-xl font-medium">
                        Our Location
                    </h2>

                    <div className="overflow-hidden rounded-lg border border-border">
                        <iframe
                            title="Hotela Location"
                            src={mapsEmbedSrc}
                            width="100%"
                            height="280"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin
                            className="h-4 w-4 shrink-0 text-muted-foreground"
                            strokeWidth={1.5}
                        />
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            {address}
                        </p>
                    </div>
                </Card>
            </section>
        </>
    );
}
