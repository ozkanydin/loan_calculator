export type LoanPayment = {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
};

export type LoanSummary = {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    payments: LoanPayment[];
};

export const calculateLoan = (
    amount: number,
    interestRate: number,
    term: number
): LoanSummary => {
    // Aylık faiz oranı hesaplama (yıllık faiz / 12)
    const monthlyInterestRate = interestRate / 12 / 100;

    // Aylık ödeme hesaplama
    const monthlyPayment =
        (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) /
        (Math.pow(1 + monthlyInterestRate, term) - 1);

    let remainingBalance = amount;
    const payments: LoanPayment[] = [];
    let totalInterest = 0;

    // Her ay için ödeme detaylarını hesapla
    for (let month = 1; month <= term; month++) {
        const interestPayment = remainingBalance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;

        totalInterest += interestPayment;
        remainingBalance -= principalPayment;

        payments.push({
            month,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            remainingBalance: Math.max(0, remainingBalance), // Negatif bakiye olmaması için
        });
    }

    return {
        monthlyPayment,
        totalPayment: monthlyPayment * term,
        totalInterest,
        payments,
    };
};

// Para birimini formatla
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

// Yüzdeyi formatla
export const formatPercent = (percent: number): string => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(percent / 100);
}; 