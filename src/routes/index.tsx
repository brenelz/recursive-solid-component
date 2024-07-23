import { createAsync, RouteDefinition } from "@solidjs/router";
import { HiSolidChevronRight, HiSolidDocument, HiSolidFolder } from "solid-icons/hi";
import { createSignal, For, Show } from "solid-js";
import { getNodes } from "~/lib/api";

type Node = {
  name: string;
  nodes?: Node[];
}

export const route = {
  preload: () => {
    void getNodes();
  }
} satisfies RouteDefinition;

export default function Home() {
  const nodes = createAsync(() => getNodes());
  return (
    <div class="p-8 max-w-sm mx-auto">
      <ul>
        <For each={nodes()}>
          {(node) => (
            <FileSystemItem node={node} />
          )}
        </For>
      </ul>
    </div>
  );
}

const FileSystemItem = (props: { node: Node }) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <li class="my-1.5">
      <span class="flex items-center gap-1.5">
        <Show when={props.node.nodes && props.node.nodes.length > 0}>
          <button onClick={() => setIsOpen(!isOpen())}>
            <HiSolidChevronRight class={`size-4 text-gray-500 ${isOpen() ? 'rotate-90' : ''}`} />
          </button>
        </Show>

        <Show when={props.node.nodes} fallback={<HiSolidDocument class="ml-[22px] size-6 text-gray-900" />}>
          <HiSolidFolder class={`size-6 text-sky-500 ${props.node.nodes?.length === 0 ? 'ml-[22px]' : ''}`} />
        </Show>

        {props.node.name}
      </span>

      <Show when={isOpen()}>
        <ul class="pl-6">
          <For each={props.node.nodes}>
            {(node) => (
              <FileSystemItem node={node} />
            )}
          </For>
        </ul>
      </Show>
    </li>
  );
}
