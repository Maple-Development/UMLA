import { vitePreprocess } from '@sveltejs/kit/vite';
//import adapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter({
      // See below for an explanation of these options
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),
  },

  preprocess: [vitePreprocess({})],
};
