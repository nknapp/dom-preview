<script setup>
import NpmLink from './components/NpmLink.vue';
</script>

# Motivation

In 2022, I watched the a JSConf Korea 2022 Talk by Hung Viet Nguyen: [How I Got 1600 Stars on GitHub in 2 months of Open Source Work ](https://www.youtube.com/watch?v=1CZjE3cDLbY).

He presented his project <NpmLink package="jest-preview" /> which had gone viral in that year.

When I saw this, I thought: "This is what I always needed." Usually, when you debug unit-tests in `jest` or `vitest`,
all you get is a dump of the DOM written into the console. Not very helpful when trying to figure out what is going
wrong.

But with `jest-preview`, you can actually see it. And there was <NpmLink package="vitest-preview" /> as well.

I tried it out, showed it to my colleagues, and they liked it too, so we used it since then.

Sooner or later, we saw that...

## ...`vitest-preview` had some issues:

- **The values of input fields were not visible in the preview.** The reason is simple. They are not part of the HTML and the HTML is all the `jest-preview`
  copies over to the file
- The currently focused element was not visible for the same reason.
- Sometimes it would have been nice to have multiple `debug` statements side-by-side, so that you can compare them and locate the actual
  failure more easily.

This project is an attempt to solve those issues and make the tool framework independent.

It is a complete rewrite.

I have more ideas about what could be done, such as using a MutationObserver to get all the modifications in a test.

Try it out and have fun...

---

If you want to help out, there are two things you can do

## Help maintain this project

I tried to keep dependencies to a minimum, but they still need to be upgraded regularly.
Even without any new features and changes, code tends to deteriorate, because the environment changes (i.e. dependencies).
It would be good if I am not the only one who takes care of this.

Answering issues and help review MRs is also a thing that would be nice, when the time comes.

## Spend a coffee :coffee:

You can also send me money, if you like my work:

- [Liberapay](https://de.liberapay.com/nils.knappmeier/)
- [Paypal](https://www.paypal.com/donate/?hosted_button_id=GB656ZSAEQEXN)

I have spent several days on this project so far. I haven't counted. Although I am not in strict need,
a little donation is a good motivator to continue.
