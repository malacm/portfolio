declare module 'roughjs' {
	export interface RoughOptions {
		roughness?: number;
		stroke?: string;
		strokeWidth?: number;
		fillStyle?: string;
		[key: string]: any;
	}

	export interface RoughSVG {
		rectangle(x: number, y: number, width: number, height: number, options?: RoughOptions): SVGElement;
		[key: string]: any;
	}

	export function svg(element: SVGElement): RoughSVG;
	export default { svg };
} 