export default {
  async fetch(request, env, ctx) {
    return await getAssetFromKV(request); // or your static asset handler
  },
};
