/** @jsx h */
import { h } from "preact";
import { ErrorPageProps } from "$fresh/server.ts";

export default function Error500Page({ error }: ErrorPageProps) {
  return <p>Uhoh fucky wucky 500 error: {(error as Error).message}</p>;
}
