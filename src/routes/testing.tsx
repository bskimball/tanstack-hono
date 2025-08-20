import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/testing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/testing"!</div>
}
