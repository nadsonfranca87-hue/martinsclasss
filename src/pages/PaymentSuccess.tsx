import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-6">
        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
        <h1 className="font-display text-3xl text-foreground">Pagamento Confirmado!</h1>
        <p className="font-body text-muted-foreground">
          Seu pedido foi recebido com sucesso. Você receberá atualizações pelo WhatsApp.
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

export default PaymentSuccess;
