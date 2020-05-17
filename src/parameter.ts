// Parameters {{{
export namespace Parameters {
    // proton mass (kg)
    export const AU = 1.67262189e-27;
    // proton charge (C)
    export const EE = 1.60217662e-19;
    // Boltzmann constant (J/K)
    export const KB = 1.38064852e-23;
    // angstrom (m)
    export const AA = 1.00000000e-10;
    // nano metor
    export const NM = 1.00000000e-9;
    // femto second (s)
    export const FS = 1.00000000e-15;
    //
    export const molecules = [
    //   mass(kg),    charge(C),  epsilon(T), sigma(A),    dt(*FS)
       [   4.003e0*AU,  0e0*EE,    10.2e0*KB,  2.576e0*AA,   5e0*FS ], // 0 "He"
       [  20.183e0*AU,  0e0*EE,    36.2e0*KB,  2.976e0*AA,  10e0*FS ], // 1 "Ne"
       [  39.948e0*AU,  0e0*EE,   124.0e0*KB,  3.418e0*AA,  25e0*FS ], // 2 "Ar"
       [  83.500e0*AU,  0e0*EE,   190.0e0*KB,  3.610e0*AA,  25e0*FS ], // 3 "Kr"
       [ 131.300e0*AU,  0e0*EE,   229.0e0*KB,  4.055e0*AA,  25e0*FS ], // 4 "Xe"
       [ 200.590e0*AU,  0e0*EE,   851.0e0*KB,  2.898e0*AA,  25e0*FS ], // 5 "Hg"
       [   2.016e0*AU,  0e0*EE,    33.3e0*KB,  2.968e0*AA,   5e0*FS ], // 6 "H2"
       [  28.013e0*AU,  0e0*EE,    91.5e0*KB,  3.681e0*AA,  20e0*FS ], // 7 "N2"
       [  31.999e0*AU,  0e0*EE,   113.0e0*KB,  3.433e0*AA,  20e0*FS ], // 8 "O2"
       [ 200.000e0*AU,  0e0*EE,   124.0e0*KB, 10.000e0*AA,  25e0*FS ]  // 9 "BP"
    ];

    // color pallette
    export const colorMap = [
      "#FB45A3", // He
      "#38CE97", // Ne
      "#D32F2F", // Ar
      "#FF5722", // Kr
      "#3F51B5", // Xe
      "#8BC34A", // Hg
      "#FF9800", // H2
      "#673AB7", // N2
      "#7D6C46", // O2
      "#7D6C46"  // BP
    ];
};
// }}}

