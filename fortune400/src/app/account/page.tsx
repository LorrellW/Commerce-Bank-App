
export default function accountPage(){
    return(
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-8 pb-20 gap-16 sm:pt-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex gap-4 items-center flex-col sm:flex-row pt-40 pr-28">
              <a
            className="rounded-full border border-solid border-black/[.08]  dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            target="_blank"
            rel="noopener noreferrer"
          >
            Account
          </a>
        </div>
    
    </div>
    );
    }