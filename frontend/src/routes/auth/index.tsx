import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/auth/ in d e x"!</div>;
}
