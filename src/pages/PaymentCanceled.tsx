import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-6">
        <XCircle className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="font-display text-3xl text-foreground">Pagamento Cancelado</h1>
        <p className="font-body text-muted-foreground">
          O pagamento não foi concluído. Seus itens ainda estão no carrinho.
        </p>
        <Link
          to="/"
          className="inline-block font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors"
        >
          Voltar à Loja
        </Link>
      </div>
    </div>
  );
};

export default PaymentCanceled;
