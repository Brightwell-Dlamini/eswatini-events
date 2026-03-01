interface PasswordStrengthMeterProps {
  password: string;
  strength?: number;
}

export function PasswordStrengthMeter({
  password,
  strength,
}: PasswordStrengthMeterProps) {
  const calculatedStrength = strength ?? calculateStrength(password);

  function calculateStrength(pwd: string): number {
    if (!pwd) return 0;

    let score = 0;
    // Length scoring
    if (pwd.length >= 12) score += 2;
    else if (pwd.length >= 8) score += 1;

    // Character diversity scoring
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

    const diversityScore = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
      Boolean
    ).length;

    score += diversityScore;

    return Math.min(score, 5); // Cap at 5
  }

  const strengthLabels = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong',
    'Very Strong',
  ];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-emerald-600',
  ];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Strength: {strengthLabels[calculatedStrength]}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {calculatedStrength}/5
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[calculatedStrength]}`}
          style={{ width: `${(calculatedStrength / 5) * 100}%` }}
          role="progressbar"
          aria-valuenow={calculatedStrength}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-label={`Password strength: ${strengthLabels[calculatedStrength]}`}
        />
      </div>
    </div>
  );
}
