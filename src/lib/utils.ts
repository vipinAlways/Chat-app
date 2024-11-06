import { clsx, type ClassValue } from "clsx"
import { Key } from "lucide-react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function chatHrefConstructor(id1:string,id2:string){
  const sortedIds = [id1,id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`
}

export function topusherKey(Key:string){
  return Key.replace(/:/g,'__')
}