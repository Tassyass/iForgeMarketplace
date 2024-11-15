import { Button } from "@/components/ui/button";

function ErrorPage() {
  return (
    <div className="container min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-destructive">Something went wrong</h1>
        <p className="text-muted-foreground">We're sorry, but there was an error loading this page.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
        <Button variant="outline" asChild className="ml-2">
          <a href="/">Return Home</a>
        </Button>
      </div>
    </div>
  );
}

export default ErrorPage;
