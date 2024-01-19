import { RouteHandler } from 'bnkit/server'
import { renderToReadableStream } from 'react-dom/server'

export const createReactStreamHandler = async ({
  renderNode,
  entryPath,
}: {
  renderNode: React.ReactNode
  entryPath: string
}) => {
  const reactDomStreamHandler: RouteHandler<any> = async (req) => {
    const stream = await renderToReadableStream(renderNode, {
      bootstrapScripts: [entryPath],
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }

  return reactDomStreamHandler
}
