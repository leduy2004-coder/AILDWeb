interface notificationType {
  avatar: string;
  title: string;
  subtitle: string;
}

const notifications: notificationType[] = [
  {
    avatar: '/images/logo.png',
    title: 'Roman Joined the Team!',
    subtitle: 'Congratulate him',
  },
  {
    avatar: '/images/logo.png',
    title: 'New message received',
    subtitle: 'Salma sent you new message',
  },
  {
    avatar: '/images/logo.png',
    title: 'New Payment received',
    subtitle: 'Check your earnings',
  },
  {
    avatar: '/images/logo.png',
    title: 'Jolly completed tasks',
    subtitle: 'Assign her new tasks',
  },
  {
    avatar: '/images/logo.png',
    title: 'Roman Joined the Team!',
    subtitle: 'Congratulate him',
  },
  {
    avatar: '/images/logo.png',
    title: 'New message received',
    subtitle: 'Salma sent you new message',
  },
  {
    avatar: '/images/logo.png',
    title: 'New Payment received',
    subtitle: 'Check your earnings',
  },
  {
    avatar: '/images/logo.png',
    title: 'Jolly completed tasks',
    subtitle: 'Assign her new tasks',
  },
];

// Messages dropdown

interface messageType {
  avatar: string;
  title: string;
  subtitle: string;
  time: string;
}

const messages: messageType[] = [
  {
    avatar: '/images/logo.png',
    title: 'Roman Joined the Team!',
    subtitle: 'Congratulate him',
    time: '9:08 AM',
  },
  {
    avatar: '/images/logo.png',
    title: 'New message received',
    subtitle: 'Salma sent you new message',
    time: '19:08 PM',
  },
  {
    avatar: '/images/logo.png',
    title: 'New Payment received',
    subtitle: 'Check your earnings',
    time: '4:15 AM',
  },
  {
    avatar: '/images/logo.png',
    title: 'Jolly completed tasks',
    subtitle: 'Assign her new tasks',
    time: '9:08 AM',
  },
  {
    avatar: '/images/logo.png',
    title: 'Roman Joined the Team!',
    subtitle: 'Congratulate him',
    time: '12:08 AM',
  },
];

// apps dropdown

interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
}

const appsLink: appsLinkType[] = [
  {
    href: '/apps/chats',
    title: 'Chat Application',
    subtext: 'New messages arrived',
    avatar: '/images/svgs/icon-dd-chat.svg',
  },
  {
    href: '/apps/ecommerce/shop',
    title: 'eCommerce App',
    subtext: 'New stock available',
    avatar: '/images/svgs/icon-dd-cart.svg',
  },
  {
    href: '/apps/contacts',
    title: 'Contact Application',
    subtext: '2 Unsaved Contacts',
    avatar: '/images/svgs/icon-dd-mobile.svg',
  },
  {
    href: '/apps/blog/post',
    title: 'Blog App',
    subtext: 'added new blog',
    avatar: '/images/svgs/icon-dd-application.svg',
  },
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: '/theme-pages/pricing',
    title: 'Pricing Page',
  },
  {
    href: '/auth/login',
    title: 'Authentication Design',
  },
  {
    href: '/auth/register',
    title: 'Register Now',
  },
  {
    href: '/404',
    title: '404 Error Page',
  },
  {
    href: '/apps/note',
    title: 'Notes App',
  },
  {
    href: '/apps/user-profile/profile',
    title: 'User Application',
  },
  {
    href: '/apps/blog/post',
    title: 'Blog Design',
  },
  {
    href: '/apps/ecommerce/checkout',
    title: 'Shopping Cart',
  },
];

export { appsLink, messages, notifications, pageLinks };
