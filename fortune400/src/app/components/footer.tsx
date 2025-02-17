interface FooterProps {
    companyName?: string; // Optional prop
  }
  
  export default function Footer({ companyName = "Fortune400" }: FooterProps) {
    return (
      <footer className="flex bg-primary text-white h-32 items-center justify-center text-center py-4">
        <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
      </footer>
    );
  }