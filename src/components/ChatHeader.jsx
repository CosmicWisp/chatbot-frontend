import Button from './ui/Button';
import { PlusIcon} from './Icons';

export function ChatHeader() {
  return (
    <header className="flex sticky top-2 mx-2 mt-px header-glass z-50 border shadow-sm">
      <div className="flex-1 text-center font-semibold text-xl py-3 px-4">Nasdao AI</div>
      <div className="flex items-center gap-2 p-2">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          <PlusIcon className="mr-2 h-6 w-6" />
          <span>New Chat</span>
        </Button>
      </div>
    </header>
  );
}