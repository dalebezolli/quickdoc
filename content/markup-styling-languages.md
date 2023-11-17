---
title: Markup & Styling Languages
---

# Markup & Styling Languages

## HTML
### Compositional Elements
#### Non-Semantic Compositional Elements
##### Div
Display - Block

##### Span
Display - Inline

#### Semantic Compositional Elements
##### Article
Self contained composition which can be independently read.
**Must be identified by a Heading.**
Display - Block

##### Section
Generic standalone section.
Should be identified by a Heading.
Display - Block

---
## CSS
### object-fit - Image resizing in relation of container
Fill - Stretch the image to the entire width of the container
Contain - Resizes the image towards the closest bound
Cover - Resizes the image towards the furthest bound
None - Default behavior
Scale Down - min(None, Contain)

### object-position - horizontal and vertical alignment

---
## Notes
### Accessibility through value selection
[Px vs Rem](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/)
### Design to Code
[Pixel perfection](https://www.joshwcomeau.com/css/pixel-perfection/)
### How can we handle all screen sizes (Total Responsiveness)
Developing for smaller screen sizes seems simple, but larger screen sizes need to be checked as well.

What is optimal for larger, or wider screen sizes?
No Bleed - Keeps it compact but doesn't help readability in big screen sizes.
Content resizing - Optimal for full screen designs handled with vw. (what's the most accessible way of managing this? vw won't scale with zoom or rem)
