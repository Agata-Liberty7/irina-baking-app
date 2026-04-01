Technical Model — Dough Fermentation & Hydration
Overview

This document describes the internal algorithm used by the Bakery application to estimate:

Yeast percentage required for fermentation

Recommended dough hydration

The model is designed to be:

predictable

adjustable

explainable to professional bakers

computationally simple for mobile devices

It is not a physics model.
It is a controlled heuristic model derived from practical baking rules.

1. Model Structure

The model consists of two independent calculations:

Yeast model
Hydration model

Both models receive structured input describing the dough.

User Input
    ↓
Model Inputs
    ↓
Correction Factors
    ↓
Final Result
2. Yeast Model

The yeast model estimates the percentage of yeast relative to flour weight.

Output:

yeastPercent

Example:

0.0025 → 0.25% yeast
2.1 Base yeast from fermentation time

Base yeast is determined by cold fermentation duration.

Interpolation tables are used.

Instant yeast
Cold hours	Yeast %
1	0.8%
2	0.7%
3	0.6%
4	0.5%
5	0.42%
6	0.35%
8	0.30%
10	0.28%
12	0.25%
16	0.23%
20	0.20%
24	0.18%
Fresh yeast
Cold hours	Yeast %
3	0.7%
4	0.65%
5	0.58%
6	0.5%
8	0.42%
10	0.36%
12	0.30%
16	0.26%
20	0.23%
24	0.20%

Interpolation between points is linear.

2.2 Dough type factor

Enriched doughs ferment slower.

lean dough → factor 1.0
enriched dough → factor 1.2
2.3 Production mode factor

Professional environments are more stable.

home → factor 1.0
professional → factor 0.9
2.4 Warm fermentation factor

Warm fermentation slightly adjusts yeast.

≤1 hour warm → factor 1.1
1–4 hours → factor 1.0
≥4 hours → factor 0.9
2.5 Flour fermentation factor

Different flours affect fermentation speed.

Flour	Factor
normal	0
strong	-0.05
integral	-0.05
rye	+0.10
buckwheat	-0.10
corn	-0.05
rice	-0.05
oat	-0.15
flax	-0.20

Composite flour mixtures are calculated proportionally.

2.6 Gluten strength (W factor)

Estimated automatically from flour composition.

Typical approximations:

Flour	W
normal	220
strong	300
integral	240
rye	120
buckwheat	80
corn	60
rice	40
oat	70
flax	30

Weighted average W is calculated.

Adjustment:

W < 180 → +5% yeast
W > 280 → −5% yeast
otherwise → no change
2.7 Final Yeast Formula
Yeast =
Base
× DoughFactor
× ProductionFactor
× WarmFactor
× (1 + FlourFactor)
× WFactor
3. Hydration Model

The hydration model estimates recommended water percentage relative to flour.

Output:

hydrationPercent

Example:

65 → 65% hydration
3.1 Base hydration

User-selected base hydration:

baseHydration

Typical range:

55–75%
3.2 Flour absorption correction

Different flours absorb different amounts of water.

Flour	Hydration delta
normal	0
strong	+2
integral	+3
rye	+5
buckwheat	+4
corn	+3
rice	+2
oat	+6
flax	+8

Mixtures are calculated proportionally.

3.3 Liquid type water equivalence

Not all liquids are pure water.

Liquid	Water equivalent
water	1.00
milk	0.88
kefir	0.85
whey	0.90
plant milk	0.92
3.4 Sugar correction

Sugar binds water.

Sugar	Hydration delta
white	0
brown	+2%
panela	+5%
3.5 Fat correction

Fat slightly reduces perceived hydration.

Fat	Hydration delta
butter	−2%
oil	−3%
ghee	−3%
margarine	−2%
3.6 Egg water contribution

Eggs contain water.

Egg type	Water equivalent
whole	0.76
yolk	0.48
white	0.88
powder	0
3.7 Final Hydration Formula
Hydration =
(
BaseHydration
+ FlourAdjustments
+ SugarAdjustments
+ FatAdjustments
+ EggWaterContribution
)
× LiquidWaterEquivalent
4. Model Goals

The model aims to:

provide stable baking results

remain interpretable

avoid overfitting

allow future calibration

The model intentionally avoids:

nonlinear optimization

neural networks

large empirical datasets

The design favors transparent baking logic.

5. Future Extensions

Possible improvements:

Climate factor

Humidity and ambient temperature influence dough behavior.

Future correction:

dry climate → + hydration
humid climate → − hydration
Mixing method

Mixing strength influences gluten development.

Possible future factors:

manual
planetary
spiral
Flour W input

Allow direct W entry when available.

Preferment models

Future models may include:

poolish
biga
sourdough
levain
6. Implementation

The model is implemented in:

src/models/doughModel.ts

Primary functions:

computeYeastPercent()
computeHydration()